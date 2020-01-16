class Api::ComparesController < ApplicationController
  require 'leven_shtein'
  def create
    target = slice_words(params[:target])
    recognized = slice_words(params[:recognized])

    @operation = LevenShtein.getOperation(target, recognized)
    puts @operation
  end

  private 
    def slice_words(sentence)
      sentence.gsub(/[^a-zA-Z0-9\'\’\$\%']/, " ").gsub("\’", "\'").downcase.split(" ").compact.delete_if(&:empty?)
    end
end